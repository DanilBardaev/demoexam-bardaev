const User = require('../models/user');
const link = "https://kappa.lol/OFmCl";
exports.showProfile = async (req, res, next) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);

   
    const requestStatus = user.requestStatus;

    res.render('profile', { user, requestStatus, link: link, });
  } catch (err) {
    next(err);
  }
};
