import {z} from "zod"
import { Hono } from "hono";
import {zValidator} from "@hono/zod-validator"
import { loginSchema, registerSchema } from "../schemas";
import {deleteCookie, setCookie} from "hono/cookie"
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";


const app = new Hono()

    .get("/current", sessionMiddleware, (c) => {
    
        const user = c.get("user")
        
        return c.json({ data: user });
        }
    )

    .post(
        "/login",
        zValidator("json",loginSchema),
        async (c) =>{
        const {user_id,password} = c.req.valid("json")

        setCookie(c, AUTH_COOKIE, JSON.stringify({ user_id }), {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        }
    )

        return c.json({success:true})
     }
    )

    .post(
        "/register",
        zValidator("json",registerSchema),
        async (c) =>{
        const {user_id,email,password} = c.req.valid("json")

       setCookie(c, AUTH_COOKIE, JSON.stringify({ user_id,email,password }), {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        }
    ); 
        return c.json({success : true})

        }
    )

    .post("/logout", (c) =>{
        deleteCookie(c,AUTH_COOKIE)

        return c.json({success:true})
    })

    export default app;