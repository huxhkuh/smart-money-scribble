
-- Tags table
CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Post-tags junction table
CREATE TABLE public.post_tags (
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Enable RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

-- Anyone can read tags
CREATE POLICY "Anyone can read tags" ON public.tags FOR SELECT USING (true);

-- Admins can manage tags
CREATE POLICY "Admins can manage tags" ON public.tags FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can read post_tags
CREATE POLICY "Anyone can read post_tags" ON public.post_tags FOR SELECT USING (true);

-- Admins can manage post_tags
CREATE POLICY "Admins can manage post_tags" ON public.post_tags FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
