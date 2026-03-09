
-- Fix posts: drop all and recreate as truly PERMISSIVE
DROP POLICY IF EXISTS "public_read_published_posts" ON public.posts;
DROP POLICY IF EXISTS "admin_full_access_posts" ON public.posts;

CREATE POLICY "public_read_published_posts" ON public.posts
  AS PERMISSIVE FOR SELECT TO anon, authenticated
  USING (status = 'published'::post_status);

CREATE POLICY "admin_full_access_posts" ON public.posts
  AS PERMISSIVE FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix comments
DROP POLICY IF EXISTS "public_read_comments" ON public.comments;
DROP POLICY IF EXISTS "public_insert_comments" ON public.comments;
DROP POLICY IF EXISTS "admin_delete_comments" ON public.comments;

CREATE POLICY "public_read_comments" ON public.comments AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_comments" ON public.comments AS PERMISSIVE FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin_delete_comments" ON public.comments AS PERMISSIVE FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix post_tags
DROP POLICY IF EXISTS "public_read_post_tags" ON public.post_tags;
DROP POLICY IF EXISTS "admin_manage_post_tags" ON public.post_tags;

CREATE POLICY "public_read_post_tags" ON public.post_tags AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_manage_post_tags" ON public.post_tags AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix tags
DROP POLICY IF EXISTS "public_read_tags" ON public.tags;
DROP POLICY IF EXISTS "admin_manage_tags" ON public.tags;

CREATE POLICY "public_read_tags" ON public.tags AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_manage_tags" ON public.tags AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
