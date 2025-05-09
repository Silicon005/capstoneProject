import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
    userId: string;
    password: string;
    email: string;
}

const RegistrationForm = () => {
    const [formData, setFormData] = useState<FormData>({
        userId: "",
        password: "",
        email: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        setSubmitted(true);
    };

    return (
        <div>
            <h2>User Registration</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="userId">User ID:</label>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <button type="submit">Register</button>
                </div>
            </form>

            {submitted && (
                <div>
                    <h3>Registration Successful!</h3>
                    <p>User ID: {formData.userId}</p>
                    <p>Email: {formData.email}</p>
                </div>
            )}
        </div>
    );
};

export default RegistrationForm;