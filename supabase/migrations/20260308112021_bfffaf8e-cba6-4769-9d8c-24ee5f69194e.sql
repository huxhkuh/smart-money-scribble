-- Drop ALL restrictive policies on posts and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Anyone can read published posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can do anything with posts" ON public.posts;

-- Recreate as PERMISSIVE (this is the default, but being explicit)
CREATE POLICY "Anyone can read published posts"
ON public.posts
AS PERMISSIVE
FOR SELECT
TO public
USING (status = 'published'::post_status);

CREATE POLICY "Admins can do anything with posts"
ON public.posts
AS PERMISSIVE
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));