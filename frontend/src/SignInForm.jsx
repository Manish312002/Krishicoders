import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login, register } from "./slices/authSlice";

export function SignInForm() {
    const [flow, setFlow] = useState("signIn");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); // For register name

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate("/");
        }
    }, [navigate, userInfo]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (flow === "signIn") {
            dispatch(login({ email, password }));
        } else {
            if (!name) {
                toast.error("Name is required for sign up");
                return;
            }
            dispatch(register({ name, email, password }));
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
                {flow === "signIn" ? "Sign In" : "Sign Up"}
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {flow === "signUp" && (
                    <input
                        className="auth-input-field"
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                )}
                <input
                    className="auth-input-field"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="auth-input-field"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="auth-button" type="submit" disabled={loading}>
                    {loading ? "Loading..." : flow === "signIn" ? "Sign in" : "Sign up"}
                </button>
                <div className="text-center text-sm text-gray-600 space-y-2 mt-2">
                    <p>
                        {flow === "signIn"
                            ? "Don't have an account? "
                            : "Already have an account? "}
                    </p>
                    <button
                        type="button"
                        className="text-green-600 hover:text-green-700 hover:underline font-medium cursor-pointer"
                        onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                    >
                        {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
                    </button>
                </div>
            </form>
        </div>
    );
}
