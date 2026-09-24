CREATE POLICY "Owner reads own avatar" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'owner-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Owner uploads own avatar" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'owner-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Owner updates own avatar" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'owner-avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'owner-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Owner deletes own avatar" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'owner-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);