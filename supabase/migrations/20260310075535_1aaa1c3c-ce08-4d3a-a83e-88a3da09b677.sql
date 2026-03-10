
-- STEP 1: Drop ALL existing policies on posts
DROP POLICY IF EXISTS "public_read_published_posts" ON public.posts;
DROP POLICY IF EXISTS "admin_full_access_posts" ON public.posts;

-- STEP 2: Disable and re-enable RLS to reset
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- STEP 3: Create PERMISSIVE policies (default is PERMISSIVE when AS clause omitted)
CREATE POLICY "anyone_can_read_published_posts" ON public.posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published'::post_status);

CREATE POLICY "admin_full_access_posts" ON public.posts
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Same fix for comments
DROP POLICY IF EXISTS "public_read_comments" ON public.comments;
DROP POLICY IF EXISTS "public_insert_comments" ON public.comments;
DROP POLICY IF EXISTS "admin_delete_comments" ON public.comments;

ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_can_read_comments" ON public.comments
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "anyone_can_insert_comments" ON public.comments
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admin_can_delete_comments" ON public.comments
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Same fix for post_tags
DROP POLICY IF EXISTS "public_read_post_tags" ON public.post_tags;
DROP POLICY IF EXISTS "admin_manage_post_tags" ON public.post_tags;

ALTER TABLE public.post_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_can_read_post_tags" ON public.post_tags
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "admin_can_manage_post_tags" ON public.post_tags
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Same fix for tags
DROP POLICY IF EXISTS "public_read_tags" ON public.tags;
DROP POLICY IF EXISTS "admin_manage_tags" ON public.tags;

ALTER TABLE public.tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_can_read_tags" ON public.tags
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "admin_can_manage_tags" ON public.tags
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
