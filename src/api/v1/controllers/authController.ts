import { Request, Response } from "express";

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

/**
 * Sign in a user with Firebase Authentication.
 * Sends a request to Firebase with email and password, 
 * and returns the user's ID token and info if successful.
 * @param req - Express request object containing `email` and `password` in body
 * @param res - Express response object to send back the result
 */
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const firebaseResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await firebaseResponse.json();

    res.status(200).json({
      idToken: data.idToken,
      email: data.email,
      localId: data.localId,
      expiresIn: data.expiresIn,
      refreshToken: data.refreshToken,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Authentication failed",
        code: "AUTH_FAILED",
        timestamp: new Date().toISOString(),
      },
    });
  }
};
