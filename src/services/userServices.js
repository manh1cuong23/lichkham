import db from '../models/index';
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);


     function checkUserEmail(email){

        return new Promise(async (resolve, reject)=>{
            try{
                let user = await db.User.findOne({ where:{email: email}})
                if(user){
                    resolve(true)
                }else{
                    resolve(false)
                    
                }
            }catch(e){
                reject(e);
            }
        })

    }
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

class userServices{
    
    
    handleUserLogin  (email, password){
        return new Promise(async (resolve, reject) =>{
            try{
                let userData = {}
                let isExit = await checkUserEmail(email);
                console.log('isExit',isExit);
                if(isExit){
                    let user = await db.User.findOne({
                        attributes:['id','email','roleId','password','firstName','lastName'],
                        where:{email: email},
                        raw:true
                       
                    });
                    if(user){
                        let check = await bcrypt.compareSync(password,user.password)
                        if(check){
                            userData.errCode = 0,
                            userData.errMessage ='ok'
                            delete user.password
                            userData.user = user;
                        resolve(userData);

                        }else{
                            userData.errCode = 3 ,
                            userData.errMessage ='password is incorrect',
                            userData.check = false;
                        resolve(userData);

                        }
                    }else{
                        userData.errCode = 2;
                        userData.errMessage = "user is does not exits"
                        resolve(userData);
                    }
                  
                    
                }else{
                    userData.errCode = 1;
                    userData.errMessage = "Your email address is does not exits"
                    resolve(userData);
                }
            }catch(e){
                reject(e);
            }
        })
    }
    compareUserPassword (){
        return new Promise(async (resolve, reject) =>{
            try{

            }catch(e){
                reject(e);
            }
        })
    }
    getAllUser(userid){
        return new Promise(async (resolve, reject) =>{
            try{
                let users = 'abc';
                if(userid === 'ALL'){
                    users = db.User.findAll({
                        attributes:{
                            exclude:['password']
                        }
                    })
                }
                if(userid && userid !== 'ALL'){
                    users = db.User.findOne({
                        attributes:{
                            exclude:['password']
                        },
                        raw:true,
                        where: {id:userid}
                    })
                }
                resolve(users);
                // let  users
            }catch(e){
                reject(e);
            }
        })
    }
    createNewUser(data){
        return new Promise(async (resolve, reject) =>{
            try {
                // check Email
                function ValidateEmail(email)
                    {
                            var mailformat =       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            ;
                            if(email.match(mailformat))
                            {
                            
                            return true;
                            }
                            else
                            {
                          
                            return false;
                            }
                            }
                            let checkF = ValidateEmail(data.email);
                            if(checkF){
                                let check = await checkUserEmail(data.email);

                                // let check = checkUserEmail(d ata.email);
                                console.log('check 125 ',check)
                                console.log('het check')
                                if(check){
                                    resolve({
                                        errCode:1,
                                        message:'You email is already in used'
                                    })
                                }else{
                
                                    let hashPasswordFromBcrypt = await hashUserPassword(data.password)
                        
                                    await db.User.create({
                                        email: data.email,
                                        password: hashPasswordFromBcrypt,
                                        firstName: data.firstName,
                                        lastName: data.lastName,
                                        address: data.address,
                                        phoneNumber:data.phoneNumber,
                                        gender:data.gender,
                                        roleId: data.role,
                                        positionId: data.position,
                                        image: data.avatar
                                    })
                                    resolve({
                                        errCode:0,
                                        message:'ok'
                                    })
                                }
                            }else{
                                resolve({
                                    errCode:1,
                                    message:'email no correct'
                                })
                            }
                   
            } catch(e){
                reject(e);
            }
        })
    }
    deleteUser(userId){
        return new Promise(async (resolve, reject) =>{
            try{
                let user = await db.User.findOne({
                    where:{id:userId}
                })
                if(user){
                    console.log('user 166',user);
                    await db.User.destroy({
                        where:{id:userId}
                    })
                    resolve({
                        errCode:0,
                        message:'the user is deleted'
                    })

                }else{
                    resolve({
                        errCode:2,
                        errMessage:'no have user'
                    })
                }
            }catch(e){
                reject(e)
            }
        })}
    updateUserData(data){
        return new Promise(async (resolve, reject) =>{
            try{
                let user = await db.User.findOne({
                    where:{id:data.id},
                    raw:false
                    
                })

                if(user){
                    

                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    user.address = data.address;
                    user.roleId = data.role;
                    user.positionId = data.position;
                    user.gender = data.gender;
                    user.phonenumber = data.phoneNumber;
                    if(data.avatar){
                        user.image = data.avatar;
                    }

                     await user.save()
                    resolve({
                        errCode:0,
                        message: 'update user success'
                    })

                }else{
                    resolve({
                        errCode:1,
                        errMessage:'update user error'
                    })
                }
            }catch(e){
                reject(e)
            }
        })
    }
    getAllCodeService(typeInput){
        return new Promise(async (resolve, reject) =>{
            try{
               
                if(typeInput){
                    let res = {};
                    let allcode = await db.Allcode.findAll(
                        {
                            where:{type:typeInput}
                        }
                    );
                    res.errCode = 0;
                    res.data = allcode
                    resolve(res);

                }else{
                    resolve({
                        errCode:1,
                        errMessage:"Mising error"
                    })
                }
            }catch(e){
                reject(e);
            }
        })
    }
   
}
module.exports = new userServices