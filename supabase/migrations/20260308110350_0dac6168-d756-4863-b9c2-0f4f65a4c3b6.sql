-- Drop existing restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Anyone can read published posts" ON public.posts;

CREATE POLICY "Anyone can read published posts"
ON public.posts
FOR SELECT
TO anon, authenticated
USING (status = 'published'::post_status);