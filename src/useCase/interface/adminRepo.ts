import User from "../../domain/user"
import sp from "../../domain/sp";


interface adminRepo {
    getUnVerifiedServices(): Promise<{}[] | null>
}

export default adminRepo