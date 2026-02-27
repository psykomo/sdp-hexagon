import { type IdentitasPort, createIdentitasClient, IdentitasService } from '@sdp/wbp-identitas';
export const name = "@sdp/runtime";


export function createRuntime() {
    return {
        // identitas service as microservice
        // identitasService: createIdentitasClient() as IdentitasPort,

        // identitas service as local service
        identitasService: new IdentitasService() as IdentitasPort,
    }
}
