import express, { Application, Request, Response } from "express";
import { generate } from "generate-password";
import { passwordStrength } from "check-password-strength";

const app: Application = express();

const port = process.env.PORT || 8080;

app.listen(port, () => console.log("Server running"));

app.get("/", (req: Request, res: Response) => {
  const length = JSON.parse(req.query.length?.toString() ?? '15');
  const numbers = JSON.parse(req.query.numbers?.toString() ?? 'false');
  const lowercase = JSON.parse(req.query.lowercase?.toString() ?? 'true');
  const uppercase = JSON.parse(req.query.uppercase?.toString() ?? 'false');
  const symbols = JSON.parse(req.query.symbols?.toString() ?? 'false');

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
      id: 1,
      value: "Very weak",
      minDiversity: 0,
      minLength: 0,
    },
    {
      id: 2,
      value: "Weak",
      minDiversity: 1,
      minLength: 6,
    },
    {
      id: 3,
      value: "Medium",
      minDiversity: 2,
      minLength: 8,
    },
    {
      id: 4,
      value: "Strong",
      minDiversity: 3,
      minLength: 12,
    },
    {
      id: 5,
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
