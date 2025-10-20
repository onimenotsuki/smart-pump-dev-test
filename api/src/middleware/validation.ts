import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
    return;
  }
  next();
};

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
  handleValidationErrors,
];

export const validateUserUpdate = [
  body('name.first')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('name.last')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('Phone must be between 1 and 20 characters'),
  body('address')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Address must be between 1 and 200 characters'),
  body('company')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Company must be between 1 and 100 characters'),
  handleValidationErrors,
];
