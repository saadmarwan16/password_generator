import express, { Application, Request, Response } from "express";
import { generate } from "generate-password";
import { passwordStrength } from "check-password-strength";

const app: Application = express();

app.listen(8000, () => console.log("Server running"));

app.get("/", (req: Request, res: Response) => {
  // const some_length = JSON.parse(req.query.length as string) as string;
  const length = (req.query.length as unknown as number) || 15;
  const numbers = (req.query.numbers as unknown as boolean) || false;
  const lowercase = (req.query.lowercase as unknown as boolean) || true;
  const uppercase = (req.query.uppercase as unknown as boolean) || false;
  const symbols = (req.query.symbols as unknown as boolean) || false;

//   console.log(length)
//   console.log(numbers)
//   console.log(lowercase)
//   console.log(uppercase)
//   console.log(symbols)

  if (length < 4) {
    res.status(500).json({ error: "Password length must be 4 or greater" });
    return;
  }

  if (!numbers && !lowercase && !uppercase && !symbols) {
    res.status(500).json({
      error:
        "At least one of ['numbers', 'lowercase', 'uppercase', 'symbols'] must be true",
    });
    return;
  }

  const password = generate({
    length,
    numbers,
    lowercase,
    uppercase,
    symbols,
  });

  const generatedPasswordStrength = passwordStrength(password, [
    {
      id: 0,
      value: "Very weak",
      minDiversity: 0,
      minLength: 0,
    },
    {
      id: 1,
      value: "Weak",
      minDiversity: 1,
      minLength: 6,
    },
    {
      id: 2,
      value: "Medium",
      minDiversity: 2,
      minLength: 8,
    },
    {
      id: 3,
      value: "Strong",
      minDiversity: 3,
      minLength: 12,
    },
    {
      id: 4,
      value: "Very Strong",
      minDiversity: 4,
      minLength: 16,
    },
  ]);

  res.status(200).json({
    results: {
      password,
      ...generatedPasswordStrength,
    },
  });
});
