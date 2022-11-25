const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    passwordConfirm: {
      type: String,
   },
    tel: {
      type: String,
    },
    work: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    deletedAt: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);


userSchema.plugin(mongoosePaginate)

userSchema.pre(/^find/, function (next) {
  this.select("-__v -createdAt -updatedAt -password -passwordConfirm");
  next();
});

userSchema.pre("save", function (next) {
  if(this.isModified("email"))
     this.email = this.email.toLocaleLowerCase();
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.methods.correctPassword = async function (
  otherPassword,
  userPassword
) {
  return await bcrypt.compare(otherPassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};


module.exports = mongoose.model("User", userSchema);
