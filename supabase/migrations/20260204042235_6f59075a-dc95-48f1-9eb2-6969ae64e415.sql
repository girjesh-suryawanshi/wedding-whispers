-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create weddings table for wedding details
CREATE TABLE public.weddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  wedding_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT NOT NULL,
  bride_photo TEXT,
  groom_photo TEXT,
  bride_parents TEXT,
  groom_parents TEXT,
  rsvp_phone TEXT,
  rsvp_email TEXT,
  custom_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on weddings
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;

-- Wedding policies
CREATE POLICY "Users can view their own weddings"
  ON public.weddings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weddings"
  ON public.weddings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weddings"
  ON public.weddings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weddings"
  ON public.weddings FOR DELETE
  USING (auth.uid() = user_id);

-- Create wedding_events table
CREATE TABLE public.wedding_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  custom_name TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_time TEXT NOT NULL,
  venue TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on wedding_events
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;

-- Wedding events policies (join with weddings to check ownership)
CREATE POLICY "Users can view their wedding events"
  ON public.wedding_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.weddings 
      WHERE weddings.id = wedding_events.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create events for their weddings"
  ON public.wedding_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.weddings 
      WHERE weddings.id = wedding_events.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their wedding events"
  ON public.wedding_events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.weddings 
      WHERE weddings.id = wedding_events.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their wedding events"
  ON public.wedding_events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.weddings 
      WHERE weddings.id = wedding_events.wedding_id 
      AND weddings.user_id = auth.uid()
    )
  );

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weddings_updated_at
  BEFORE UPDATE ON public.weddings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for wedding photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-photos', 'wedding-photos', true);

-- Storage policies for wedding photos
CREATE POLICY "Anyone can view wedding photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-photos');

CREATE POLICY "Authenticated users can upload wedding photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wedding-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'wedding-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'wedding-photos' AND auth.uid()::text = (storage.foldername(name))[1]);