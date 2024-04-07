# subworker

本项目受[psub](https://github.com/bulianglin/psub)项目的启发，进一步实现了更透明化的混淆订阅转换服务

psub项目虽然混淆了节点的密码和域名部分，但是一方面大部分使用者都只是借用订阅转换的平台实现**自用的**多个订阅链接或节点和配置的整合工作，重新搭建一个更安全的订阅转换服务从功能上来说并没有满足用户定制化的需求

另一方面，psub项目虽然看上去是另一个订阅转换服务，但是由于需要先获取订阅链接中的每一条代理链接再进行混淆，因此他破坏了订阅链接的完整性，从而使得用户提交的链接和后端接收到的链接不一致，导致了一系列生成结果的非预期错误，例如如果你熟知subconverter项目的配置文件格式，其中就包含了使用`GROUPID`指定每一条订阅链接归属的组，由于psub搭建的项目转换后端接收到的是一大堆代理链接，如果你的配置文件中包含了`GROUPID`，最后生成的转换结果将会和直接使用订阅转换的结果相差甚远

## 实现原理

如何在混淆的同时，实现完全透明，完全个人定制化的订阅整合+转换服务呢，下面是subworker的实现原理

![image](https://github.com/Chilly-Blaze/subworker/assets/74091261/8e86ca05-2962-4314-abf1-846bec21e1a7)

可以发现，在订阅转换后端看来，虽然订阅链接的请求地址变了（即隐藏了原订阅链接的信息），但是他仍然是一个订阅链接，转换后端需要向subworker请求获取到这个订阅链接包含的节点信息（当然获取的节点也是混淆后的无效节点），从而实现订阅文件的生成

subworker同样支持单条的节点，它会将其封装成另一条“订阅链接”交付给订阅转换后端

同时，在用户看来，自己只是简单的通过携带一把只有自己知道的token，向一个自己的worker（你还可以给这个worker指定一个自己的域名，使其更加好记）请求订阅信息，worker在经过了一段时间之后返回了整合完毕的多条订阅链接的订阅文件，这个自己都能记住的简单的链接返回的文件与直接使用订阅转换服务搞了一大串的链接所生成的文件完全一致，同样方便了用户

## 如何使用

由于本项目内含多个worker所需要的环境变量，因此只推荐使用本地编译提交的方式进行部署

1. 将本项目clone或下载到本地
2. `npm install`下载所需依赖（yarn或pnpm等其他包管理器雷同）
3. 执行`npx wrangler kv:namespace create SUB_KV`创建一个KV命名空间，需要根据要求绑定cloudflare账号，成功之后终端将会返回`{ binding = "SUB_KV", id = "xxxxxxx" }`类似内容，复制其中的id字段（即此处的`xxxxxxx`）
4. 进入`wrangler-template.toml`文件，根据其中的注释修改相应字段，并将上面复制的id部分粘贴到相应位置
5. 将`wrangler-template.toml`文件修改为`wrangler.toml`
6. 执行`npx wrangler dev`本地测试运行，之后通过浏览器访问`http://localhost:8787/`，若出现`Hello World!`则说明服务启动正常
7. 键入`x`退出运行，执行`npx wrangler deploy`部署cloudflare远程，打开你的cloudflare远程`dashboard->Workers & Pages->Overview`确认是否部署成功
8. `http://[workers域名]/clash?token=[设置token]`即为clash客户端的订阅链接
9. 之后若希望修改订阅链接或token，可以进入workers中的`Settings->Variables`修改对应项
10. 默认情况下，每隔6小时将会自动获取一次订阅链接中的节点信息，若修改了环境变量，或希望手动更新订阅链接可访问`http://[workers域名]/reset?token=[设置token]`，等待一会，返回`Reset Complete!`则说明更新成功

## 注意

本项目目前只支持clash的订阅转换（shadowrocket未测试，应该也没问题），对于v2rayN之类的客户端可以通过`http://[workers域名]?token=[设置token]`这个接口来获取所有原始的节点信息（base64），由于本人目前没有使用其他客户端的需求（也没办法进行测试）因此暂不支持其他客户端

每一次订阅信息的获取和更新（但单纯访问`http://[workers域名]`不会花费）都需要花费若干cloudflare的kv访问数量，这个数量和订阅链接的数量呈正相关，kv读取每天似乎是限制1000个，如果你需要集成过多的节点或订阅（例如上百个），本项目或许并不适合

如果希望修改subworker请求订阅转换后端的链接格式，请前往`src/api/request.ts`中修改`assemblySubRequest`变量
