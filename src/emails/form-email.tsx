export const FormEmail = ({
  firstName,
  lastName,
  email,
  message,
}: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) => {
  return (
    <div>
      <h1>Form Email from Weather.io</h1>
      <p>
        {firstName} {lastName}
      </p>
      <p>{email}</p>
      <p>{message}</p>
    </div>
  );
};
