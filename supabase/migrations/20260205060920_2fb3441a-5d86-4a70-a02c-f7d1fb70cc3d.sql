-- Add share_token column to weddings table for public sharing
ALTER TABLE public.weddings
ADD COLUMN share_token TEXT UNIQUE;

-- Create index for faster lookups by share_token
CREATE INDEX idx_weddings_share_token ON public.weddings(share_token);

-- Allow public read access when accessing via share_token
CREATE POLICY "Public can view weddings via share token"
ON public.weddings
FOR SELECT
USING (share_token IS NOT NULL AND share_token = current_setting('request.headers', true)::json->>'x-share-token');

-- Create a function to get wedding by share token (bypasses RLS for public access)
CREATE OR REPLACE FUNCTION public.get_wedding_by_share_token(token TEXT)
RETURNS TABLE (
  id UUID,
  bride_name TEXT,
  groom_name TEXT,
  wedding_date TIMESTAMPTZ,
  venue TEXT,
  bride_photo TEXT,
  groom_photo TEXT,
  bride_parents TEXT,
  groom_parents TEXT,
  rsvp_phone TEXT,
  rsvp_email TEXT,
  custom_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id,
    w.bride_name,
    w.groom_name,
    w.wedding_date,
    w.venue,
    w.bride_photo,
    w.groom_photo,
    w.bride_parents,
    w.groom_parents,
    w.rsvp_phone,
    w.rsvp_email,
    w.custom_message
  FROM public.weddings w
  WHERE w.share_token = token;
END;
$$;

-- Create a function to get wedding events by wedding id (for public access)
CREATE OR REPLACE FUNCTION public.get_wedding_events_by_wedding_id(wedding_uuid UUID)
RETURNS TABLE (
  id UUID,
  event_type TEXT,
  custom_name TEXT,
  event_date TIMESTAMPTZ,
  event_time TEXT,
  venue TEXT,
  description TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the wedding has a share token (is publicly shared)
  IF NOT EXISTS (SELECT 1 FROM public.weddings w WHERE w.id = wedding_uuid AND w.share_token IS NOT NULL) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    e.id,
    e.event_type,
    e.custom_name,
    e.event_date,
    e.event_time,
    e.venue,
    e.description
  FROM public.wedding_events e
  WHERE e.wedding_id = wedding_uuid
  ORDER BY e.event_date ASC;
END;
$$;