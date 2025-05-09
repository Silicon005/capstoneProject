
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import {SquarePen, Eye, EyeOff} from 'lucide-react';
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react";
import { useUser } from "../hooks/userContext"; 

import axios from "axios";
// import { Label } from "@/components/ui/label";


interface User{
    name: string;
    email: string;
    role: "student" | "teacher" | "admin";
    phone: string;
    school: string;
    imageURL: string;
    userName: string;
    prn:string;
}

// const userInfo: User = {
//     name: "Gahinath Madake",
//     email: "gahinathmadake@gmail.com",
//     role: "student",
//     phone: "+91 8767748537",
//     school: "School of Computer Engineering",
//     imageURL: "https://github.com/shadcn.png",
//     username: "Gahinathmadake",
//     prn: "202201040100",
// };




const profile = () => {
    const [editProfileImage, setEditProfileImage] = useState<boolean>(false);
    const [editPersonalDetails, setEditPersonalDetails] = useState<boolean>(false);

    // // Password Change Details
    // const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    // const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    // const [newPassword, setNewPassword] = useState<string>("");
    // const [currentPassword, setCurrentPassword] = useState<string>("");

    // set profilePic
    const [user, setUser] = useState<User>({
        name: "",
        email: "",
        role: "student",
        phone: "",
        school: "",
        imageURL: "",
        userName: "",
        prn: "",
      });
      

    const [fname, setFname] = useState<string>("");
    const [lname, setLname] = useState<string>("");
      const { userId } = useUser();
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await axios.get(`http://localhost:3000/api/user/profile/${userId}`);
            console.log(res);
            if (res.data?.success) {
              setUser(res.data.user);
            }
          } catch (err) {
            console.error("Error fetching user profile:", err);
          }
        };
    
        if (userId) fetchUser();
      }, [userId]);
    

    useEffect(() => {
        const [first, last = ""] = user.name.split(" ");
        setFname(first);
        setLname(last);
    }, [user.name]); // Runs when `user.name` changes

    const [profilePicUrl, setProfilePicURL] = useState<string>(user.imageURL ? user.imageURL : "https://github.com/shadcn.png");

    // const [profilePicUrl, setProfilePicURL] = useState<string>("");

    useEffect(() => {
    if (user.imageURL) {
        setProfilePicURL(user.imageURL);
    }
    }, [user.imageURL]);



    async function editPersonalDetailsHandller(){
        setEditPersonalDetails(!editPersonalDetails);
    }

    async function imageUploadHandller(){
        setEditProfileImage(!editProfileImage);
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          setProfilePicURL(imageUrl);
        }
    };

    async function submitPersonalDetailsHandller(){
        console.log(user);
        setUser((prev) => ({
            ...prev,
            name: (fname+ " " +lname),
        }))

        console.log(user);

        setEditPersonalDetails(false);
    }

    

  return (
    <div className="px-20 py-4">

        {/* -------------------------------  Image Details -------------------------------- */}
        <div className="w-10/12 p-3 bg-sidebar rounded-sm shadow-lg flex justify-between items-center">
            
            {/*Profile Section*/}
            <div className="flex gap-5">
                <Avatar className="w-20 h-20 inline-block">
                    <AvatarImage src={profilePicUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="inline-block pt-3">
                    <h1 className="text-xl font-semibold">
                        {user.name}
                    </h1>
                    <p>
                        {user.email}
                    </p>
                </div>
            </div>

            {/* Button
            {
                editProfileImage
                ?
                <Button onClick={imageUploadHandller}>Save</Button>
                :
                <Button
                    onClick={()=>{
                        setEditProfileImage(!editProfileImage);
                    }}
                >
                    <SquarePen/> Edit</Button>
            } */}
        </div>





        {/* -------------------------------  Personal Details -------------------------------- */}
        <div className=" w-10/12 p-3 bg-sidebar rounded-sm shadow-lg mt-10">

            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">Personal Details</h1>
                {
                    !editPersonalDetails &&
                    <Button onClick={editPersonalDetailsHandller}><SquarePen/> Edit</Button>
                }
            </div>
            
            <div className="my-3 flex gap-5">
                <div className="w-6/12">
                    <label className="opacity-60 mb-1">Username</label>
                    {
                        editPersonalDetails ?
                        <Input
                            value={user.userName}
                            placeholder={user.userName}
                            readOnly
                            className="bg-sidebar-accent cursor-not-allowed"
                        />
                        :
                        <p>{user.userName}</p>
                    }
                </div>

                <div className="w-6/12">
                    <label className="opacity-60 mb-1">PRN</label>
                    {
                        editPersonalDetails ?
                        <Input
                            value={user.prn}
                            placeholder={user.prn}
                            readOnly
                            className="bg-sidebar-accent cursor-not-allowed"
                        />
                        :
                        <p>{user.prn}</p>
                    }
                </div>
            </div>

            <div className="my-3 flex gap-5">
                <div className="w-6/12">
                    <label className="opacity-60 mb-1">First Name</label>
                    {
                        editPersonalDetails ?
                        <Input
                            name = "fname"
                            value={fname} 
                            placeholder={fname}
                            onChange={(e) => setFname(e.target.value)} 
                        />
                        :
                        <p>{fname}</p>
                    }
                </div>

                <div className="w-6/12">
                    <label className="opacity-60 mb-1">Last Name</label>
                    {
                        editPersonalDetails ?
                        <Input 
                            name="lname"
                            value={lname} 
                            placeholder={lname}
                            onChange={(e)=>{ setLname(e.target.value)}}
                        />
                        :
                        <p>{lname}</p>
                    }
                </div>
            </div>

            <div className="my-3 flex gap-5">
                <div className="w-6/12">
                    <label className="opacity-60 mb-1">Phone</label>
                    {
                        editPersonalDetails ?
                        <Input
                            name="phone"
                            value={user.phone}
                            placeholder={user.phone}
                            onChange={(e) =>
                                setUser((prev) => ({
                                    ...prev,
                                    phone: e.target.value,
                                }))
                            }
                        />
                        :
                        <p>{user.phone}</p>
                    }
                    
                </div>

                <div className="w-6/12">
                    <label className="opacity-60 mb-1">Email</label>
                    {
                        editPersonalDetails ?
                        <Input
                            value={user.email}
                            placeholder={user.email} 
                            readOnly
                            className="bg-sidebar-accent cursor-not-allowed"
                        />
                        :
                        <p>{user.email}</p>
                    }
                </div>
            </div>

            <div className="my-3 flex gap-5">
                <div className="w-6/12">
                    <label className="opacity-60 mb-1">Role</label>
                    {
                        editPersonalDetails ?
                        <Input
                            value={user.role}
                            placeholder={user.role}
                            readOnly
                            className="bg-sidebar-accent cursor-not-allowed"
                        />
                        :
                        <p>{user.role}</p>
                        }
                </div>

                <div className="w-6/12">
                    <label className="opacity-60 mb-1">School</label>
                    {
                        editPersonalDetails ?
                        <Input
                            value={user.school}
                            placeholder={user.school}
                            readOnly
                            className="bg-sidebar-accent cursor-not-allowed"
                        />
                        :
                        <p>{user.school}</p>
                        }
                </div>
            </div>


            {
                editPersonalDetails && 
                <div className="flex gap-5">
                    <Button onClick={editPersonalDetailsHandller} >Cancel</Button>
                    <Button 
                        onClick={async()=>{
                            submitPersonalDetailsHandller();
                        }}
                    >Save</Button>
                </div>
            }


            

        </div>




        {/* -------------------------------  Personal Details -------------------------------- */}
        {/* <div className=" w-10/12 p-3 bg-sidebar rounded-sm shadow-lg mt-10">
            <h1 className="text-lg font-semibold">Change Password</h1>

            <div className="my-3 flex gap-5">
                <div className="w-6/12">
                    <Label className="opacity-60 mb-1">Current Password</Label>
                    <div className="relative">
                        <Input
                            name = "currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword} 
                            placeholder={"******"}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="pr-10"
                        />
                        <span className="absolute top-[20%] right-2"
                            onClick={()=>{
                                setShowCurrentPassword(!showCurrentPassword)
                            }}
                        >
                            {
                                showCurrentPassword 
                                ?
                                <EyeOff />
                                :
                                <Eye />
                            }
                        </span>
                    </div>
                </div>

                <div className="w-6/12">
                    <Label className="opacity-60 mb-1">Last Name</Label>
                    <div className="relative">
                        <Input 
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword} 
                            placeholder={"******"}
                            onChange={(e)=>{ setNewPassword(e.target.value)}}
                            className="font-semibold pr-10"
                        />

                        <span className="absolute top-[20%] right-2"
                            onClick={()=>{
                                setShowNewPassword(!showNewPassword)
                            }}
                        >
                            {
                                showNewPassword 
                                ?
                                <EyeOff />
                                :
                                <Eye />
                            }
                        </span>
                    </div>
                </div>
            </div>

        </div> */}
    </div>
  )
}

export default profile;
