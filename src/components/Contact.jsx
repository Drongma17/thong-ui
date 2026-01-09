import React, { useEffect, useRef } from "react";
import PageTitle from "./PageTitle";
import { Form, useActionData, useNavigation, useSubmit } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../app/apiClient";

export default function Contact() {
  const contactInfo = useLoaderData();
  const formRef = useRef(null);
  const actionData = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.success) {
      formRef.current?.reset();
      toast.success("Your message has been submitted successfully");
    }
  }, [actionData]);
  const handleSubmit = (event) => {
    event.preventDefault();
    const userConfirmed = window.confirm(
      "Are you sure you want to submit the form ?"
    );

    if (userConfirmed) {
      const formData = new FormData(formRef.current);
      submit(formData, { method: "post" });
    } else {
      toast.info("Form submission cancelled.");
    }
  };

  const labelStyle =
    "block text-lg font-semibold text-primary dark:text-light mb-2";
  const textFieldStyle =
    "w-full px-4 py-2 text-base border rounded-md transition border-primary dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";
  return (
    <div className="max-w-[1152px] min-h-[852px] mx-auto px-6 py-8 font-primary bg-normalbg dark:bg-darkbg">
      <PageTitle title="Contact Us" />
      <p className="max-w-[768px] mx-auto mt-8 text-gray-600 dark:text-lighter mb-8 text-center">
        We’d love to hear from you! If you have any questions, feedback, or
        suggestions, please don’t hesitate to reach out.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-[952px] mx-auto mt-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Info</h2>
        {contactInfo && (
          <>
            <p className="mb-4">
              <strong>Phone:</strong> {contactInfo.phone}
            </p>
            <p className="mb-4">
              <strong>Email:</strong> {contactInfo.email}
            </p>
            <p className="mb-4">
              <strong>Address:</strong> {contactInfo.address}
            </p>
          </>
        )}
      </div>
      <Form
        method="POST"
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-6 max-w-[768px] mx-auto"
      >
        <div>
          <label htmlFor="name" className={labelStyle}>
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your Name"
            className={textFieldStyle}
            required
            minLength={5}
            maxLength={30}
          />
          {actionData?.errors?.name && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.name}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className={labelStyle}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              className={textFieldStyle}
              required
            />
            {actionData?.errors?.email && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.errors.email}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="mobileNumber" className={labelStyle}>
            Mobile Number
          </label>
          <input
            id="mobileNumber"
            name="mobileNumber"
            type="tel"
            required
            pattern="^\d{10}$"
            title="Mobile number must be exactly 10 digits"
            placeholder="Your Mobile Number"
            className={textFieldStyle}
          />
          {actionData?.errors?.mobileNumber && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.mobileNumber}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className={labelStyle}>
            Message
          </label>
          <textarea
            name="message"
            id="message"
            rows="4"
            placeholder="Your Message"
            className={textFieldStyle}
            required
            minLength={5}
            maxLength={500}
          >
            {actionData?.errors?.message && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.errors.message}
              </p>
            )}
          </textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white dark:text-black text-xl rounded-md transition duration-200 bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </Form>
    </div>
  );
}


export async function contactAction({request, params}){
    const data = await request.formData();

    const contactData = {
    name: data.get("name"),
    email: data.get("email"),
    mobileNumber: data.get("mobileNumber"),
    message: data.get("message")
    };
    try{
        await apiClient.post("/contacts", contactData);
    }catch(error){
        if(error.response?.status === 400){
            return {success: false, error: error.response?.data};
        }
        throw new Response(
            error.response?.data?.errorMessage ||
            error.message ||
            "Failed to submit your message. Please try again. ",
            {status: error.status || 500}
        );
    }
}

export async function contactLoader(){
    try{
        const response = await apiClient.get("/contacts");
        return response.data;
    }catch(error){
        throw new Response(
            error.response?.data?.errorMessage ||
            error.message ||
            "Failed to fetch profile details. Please try again.",
            {status: error.status || 500}
        );
    }
}