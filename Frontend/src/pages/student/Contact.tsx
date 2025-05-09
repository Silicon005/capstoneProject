import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import Image from "next/image"

import { AspectRatio } from "@/components/ui/aspect-ratio"


interface ContactDetails {
  name: string;
  email: string;
  phone: string;
  query: string;
}

const Contactus: React.FC = () => {

  const navigate = useNavigate();

  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    name: "",
    email: "",
    phone: "",
    query: "",
});

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setContactDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 

    console.log(contactDetails);
  
  };

  return (
    <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      
      <div className="max-w-4xl p-4 border shadow-sm rounded-sm grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Section */}
        <div>
          <div className="w-[450px]">
            <AspectRatio ratio={16 / 9}>
              {/* <Image src="..." alt="Image" className="rounded-md object-cover" /> */}
            </AspectRatio>
          </div>

          <h1 className="text-3xl font-bold font-cinzel mb-4">Contact Us</h1>
          <p className="text-muted-foreground">
            Have a question or feedback? Reach out, and we will get back to you as soon as possible.
          </p>
        </div>

        {/* Right Section - Contact Form */}
        <div>
          <form onSubmit={formSubmitHandler} className="">
            {/* Full Name */}
            <div className="py-2 space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={contactDetails.name}
                onChange={changeHandler}
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email */}
            <div className="py-2 space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={contactDetails.email}
                onChange={changeHandler}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="py-2 space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={contactDetails.phone}
                onChange={changeHandler}
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Message */}
            <div className="py-2 space-y-2">
              <Label htmlFor="query">Message</Label>
              <Textarea
                id="query"
                name="query"
                value={contactDetails.query}
                onChange={changeHandler}
                placeholder="Enter your message"
                required
                rows={4}
              />
            </div>

            {/* Buttons */}
            <div className="py-2 mt-3 flex flex-col sm:flex-row justify-between gap-4">
              <Button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2">
                <ArrowLeft size={18} /> Go Back
              </Button>
              <Button type="submit">Submit Now</Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contactus;