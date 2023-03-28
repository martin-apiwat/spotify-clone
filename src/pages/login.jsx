import React from "react";
import { accessUrl } from "../config";

export default function Login() {
    return (
        <div className="py-10 text-center">
            <h1 className="mb-1 text-4xl font-bold">
                Welcome to my Spotify clone!
            </h1>
            <p className="mb-10 text-text-dimmed">
                Sign in to the world of music
            </p>
            <a
                href={accessUrl}
                className="rounded-xl bg-primary py-1.5 px-5 text-xl"
            >
                Sign in
            </a>
        </div>
    );
}
