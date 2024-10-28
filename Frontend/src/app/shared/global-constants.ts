// src/app/shared/global-constants.ts

export class GlobalConstants {
  // Messages for user feedback
  public static genericError: string =
    'Something went wrong. Please try again later!';
  public static unauthorized: string =
    'You are not authorized to access this page!';
  public static productExistError: string = 'Product already exist!';
  public static productAdded: string = 'Product Added Successfully!';

  // Regular expressions for input validation
  public static nameRegex: string = '[a-zA-Z0-9 ]*';
  public static emailRegex: string =
    '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
  public static contactNumberRegex: string = '^[0-9]{10}$';

  // Error types
  public static error: string = 'error';

  // Additional error messages
  public static formInvalid: string =
    'Please fill in all required fields correctly.';
}
