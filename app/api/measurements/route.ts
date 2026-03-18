import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { supabase } from "../../../lib/supabaseClient" // Using the mock client
import { NextResponse } from "next/server"

export async function GET() { // Removed req
  const session: { user?: { id?: string } } | null = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: measurements, error } = await supabase
    .from('measurements')
    .select('*')
    .eq('user_id', session.user.id);

  if (error || !measurements || measurements.length === 0) {
    return new NextResponse(JSON.stringify({ error: "Measurements not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new NextResponse(JSON.stringify(measurements[0]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
