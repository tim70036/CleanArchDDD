import Joi from 'joi';

const saferJoi = Joi.defaults((schema) => schema.options({ convert: false, presence: 'required' }));

export { saferJoi };
