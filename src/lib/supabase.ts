import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://siucwfcdlndoonaqfzwb.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

export async function uploadFileToSupabase(image_url: string, name: string) {
    try {
        console.log({ image_url, name });
        const response = await fetch(image_url);
        const buffer = await response.arrayBuffer();
        const file_name = "img_" + Date.now() + ".jpeg";
        const { data, error } = await supabase.storage
            .from("aideation")
            .upload(`public/${file_name}`, buffer, {
                contentType: "image/jpeg",
            });
        console.log({ data, error });
        return data?.fullPath;
    } catch (error) {
        console.error(error);
    }
}
