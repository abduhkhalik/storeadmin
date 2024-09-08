import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { userId } = auth()
        const body = await req.json();
        const { name } = body
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!name) {
            return new NextResponse("Nama Toko Perlu Diinput", { status: 400 })
        }
        const store = await db.store.create({
            data: {
                name,
                userId
            }
        })
        return NextResponse.json(store)
    } catch (err) {
        console.error('[STORE_POST]', err)
        return new NextResponse("Internal error", { status: 500 })
    }
}