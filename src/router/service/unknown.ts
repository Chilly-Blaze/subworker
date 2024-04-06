import response from '../../api/response'

export default async function (): Promise<Response> {
    return response.unAuthorized()
}
