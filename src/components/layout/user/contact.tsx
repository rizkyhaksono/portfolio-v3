"use client"

import { useReducer } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";

const initialState = {
  email: "",
  message: "",
};

function formReducer(state: any, action: any) {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function UserContact() {
  const [formState, dispatch] = useReducer(formReducer, initialState);

  const sendEmail = (e: any) => {
    e.preventDefault();

    const templateParams = {
      email: formState.email,
      message: formState.message,
    };

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID ?? "",
        process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID ?? "",
        templateParams,
        process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY ?? ""
      )
      .then(
        () => {
          toast.success("Email sent successfully");
          dispatch({ type: "RESET" });
        },
        (error) => {
          toast.error("Failed to send email");
          console.log('FAILED...', error);
        }
      );
  };

  return (
    <div className="flex justify-center mt-4">
      <form className="w-full max-w-md" onSubmit={sendEmail}>
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Your Email"
            value={formState.email}
            onChange={(e) => dispatch({ type: "SET_EMAIL", payload: e.target.value })}
            required
          />
          <Textarea
            placeholder="Your Message"
            value={formState.message}
            onChange={(e) => dispatch({ type: "SET_MESSAGE", payload: e.target.value })}
            required
          />
          <Button type="submit" variant={"default"} size={"sm"}>
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}