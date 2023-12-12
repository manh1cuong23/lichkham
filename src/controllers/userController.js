
import userServices from '../services/userServices';
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

function hashUserPassword  (password){
    return new Promise(async (resolve, reject)=>{
        try{
             let hashPassword = await bcrypt.hashSync(password, salt);
             resolve(hashPassword)

        }catch(e){
            reject(e);
        }

    })
}
class userController {
    async handleLogin(req, res, next){
        let email = req.body.email
        let password = req.body.password
        if(!email || !password){
            return res.status(500).json({
                errCode:1,
                message:'Missing or invalid email'
            })
        }
        let userData = await userServices.handleUserLogin(email, password);

        return res.status(200).json({
            errCode:userData.errCode,
            message:userData.errMessage,
           user: userData.user ? userData.user :{}

        })
    }
    async handleGetAllUsers(req, res, next){
        let id = req.query.id;
        let users = await userServices.getAllUser(id)
        if(!id){
            return res.status(200).json({
                errCode:1,
                errMessage:'Missing require parameters',
                users:[]
            })
        }   
        console.log('users ne',users)
        
        return res.status(200).json({
            errCode:0,
            errMessage:'ok',
            users:users
        })
    }
    async handleCreateNewUser(req, res, next){
        console.log('check req api',req.body)
        let message = await userServices.createNewUser(req.body)
        console.log(message)
        res.status(200).json(message)
    }
    async handleEditUser(req, res, next){
        let data = req.body
        console.log('nody moi ne',data)
        let message = await userServices.updateUserData(data)
        return res.status(200).json(message)
    }
    async handleDeleteUser(req, res, next){
    if(!req.body.id){
        return res.status(200).json({
            errCode:1,
            errMessage: 'Missing required parameters'
        })
    }
        let message = await userServices.deleteUser(req.body.id)
        return res.status(200).json(message)
        
    }


    async getAllCode(req, res, next) {
        try{

            let data = await userServices.getAllCodeService(req.query.type);
            return res.status(200).json(data);

        }catch(e){
            console.log("Error getting code allcode",e)
            return res.status(200).json({
                errCode:-1,
                errMessage:'Error from service'
            })
        }
    }
}

module.exports = new userController