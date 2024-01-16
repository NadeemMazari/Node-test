const LocalStrategy = require("passport-local").Strategy;
const userModel = require("./schema/userSchema");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const bcrypt = require("bcrypt");
exports.initializingPassport = (passport) => {
  passport.use(
    new LocalStrategy(async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        console.log(user);
        if (!user) return done(null, false);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false);

        return done(null, user);
      } catch (error) {
        return done(null, false);
      }
    })
  );

  passport.serializeUser((user, done)=>{
     done(null, user._id);
  });

  passport.serializeUser( async(id, done)=>{
   try {
        const user= await userModel.findById(new ObjectId(id))
     done(null, user);
   } catch (error) {
    done(null, false);
   }


 });


};
