const Joi = require('joi');

const addThoughtSchema = Joi.object().keys({
  title: Joi.string()
    .min(4)
    .max(50)
    .required(),
  description: Joi.string()
    .min(10)
    .max(1000)
    .optional()
});
const updateThoughtSchema = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string()
    .min(4)
    .max(50)
    .required(),
  description: Joi.string()
    .min(10)
    .max(1000)
    .optional()
});
module.exports = {
  async addThoughtValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, addThoughtSchema);
  },
  async updateThoughtValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, updateThoughtSchema);
  }
};
