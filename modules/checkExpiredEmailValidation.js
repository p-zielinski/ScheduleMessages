const EmailValidation = require('../models/emailValidation');
const User = require('../models/user');

let index_checking=0
const checkExpiredEmailValidation = async () => {
    if(index_checking===0){
        console.log('Scanning users with not confirmed email addresses (within first 2 days) INITIALIZED')
    }
    setTimeout(async function () {
        index_checking+=1
        console.log(`checking emails if confirmed within 2 days: ${index_checking}`)
        EmailValidation.find({expires:{
                "$lt": new Date().toISOString()
            }}, async (err, emails) => {
            if (emails.length===0) {
                console.log('checking completed - no record fined')
            } else if (emails) {
                console.log(emails)
                for(const email of emails){
                    await User.findOne({email: email.email}, async (err, userData) => {
                        if(userData){
                            if(userData.status==='pending'){
                                let progress=0
                                await User.findOneAndDelete({email: email.email}).then(
                                    progress+=1
                                ).catch(err => console.log(err))
                                await EmailValidation.findOneAndDelete({_id: email._id}).then(
                                    progress+=1
                                ).catch(err => console.log(err))
                                if(progress!==2){
                                    console.log(`error while deleting email "${email.email}" from DB `)
                                } else {console.log(`email "${email.email}" was deleted from DB`)}
                            }
                            else{
                                await EmailValidation.findOneAndDelete({_id: email._id}).catch(err => console.log(err))
                            }
                        }
                        else if(err){
                            console.log(`${err} while checking emails status`)
                        }
                    })
                }
                console.log('Checking completed')
            } else if (err) {
                console.log(`Error: ${err}\nWhile checking email expiration date`)
            }
        })
        checkExpiredEmailValidation();
    }, 3600000);
}

module.exports = checkExpiredEmailValidation;