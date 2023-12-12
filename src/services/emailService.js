// import db from '../models/index';
require('dotenv').config()
import nodemailer from 'nodemailer'


function getBodyHTMLlanguage  (language,dataSend){
    let result='';
    if(language === 'vi'){
        result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care</p>
        <p>Thông tin đặt lịch khám bệnh</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng sự thật vui lòng click vào đường link dưới đây để xác nhận</p>

        <div>
            <a href=${dataSend.redirectLink} target="_blank" >Click here</a>
            <div>Xin chân thành cảm ơn</div>
        </div>

    `
    }
    if(language==='en'){
        result=`
        <h3>   HI ${dataSend.patientName}</h3>
        <p>You received this email because you booked an online medical appointment on Booking Care</p>
        <p>Information to book a medical appointment</p>
        <div><b>Time : ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>If the above information is true, please click on the link below to confirm</p>

        <div>
            <a href=${dataSend.redirectLink} target="_blank" >Click here</a>
            <div>Thank you</div>
        </div>

    `
    }
    return result
}
function getBodyHTMLlanguageRemedy(language,dataSend){
    let result='';
    if(language === 'vi'){
        result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care thành công</p>
        <p>Thông tin đơn thuốc hóa đơn được gửi trong file đính kèm</p>
        

        <p>Xin cảm ơn</p>

        

    `
    }
    if(language==='en'){
        result=`
        <h3>   HI ${dataSend.patientName} </h3>
        <p>You received this email because you booked an online medical appointment on Booking Care on success</p>
        <p>Information to book a medical appointment</p>
        <p>Thany you so much</p>
    `
    }
    return result
}

class emailService{
    async sendSimpleEmail (dataSend){
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD    , // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <vomanhcuong06102003@gmail.com>', // sender address
            to: dataSend.reciverEmail, // list of receivers
            subject: "Thông tin đặt lịch khám bệnh", // Subject line
            html: await getBodyHTMLlanguage(dataSend.language,dataSend) , // html body
        });

    }
    async sendAttachMent(dataSend){
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD    , // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <vomanhcuong06102003@gmail.com>', // sender address
            to: dataSend.email, // list of receivers
            subject: "Kết quả đặt lịch khám bệnh", // Subject line
            html: await getBodyHTMLlanguageRemedy(dataSend.language,dataSend) , // html body
            attachments:[
                {   // define custom content type for the attachment
                    filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                    content: dataSend.imgBase64.split("base64,")[1],
                    encoding: 'base64'
                },
            ]
        });
    }
    

    }
    
   


module.exports = new emailService