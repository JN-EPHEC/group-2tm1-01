-- 1. Table des profils utilisateurs (complément de l'authentification Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'client',
    phone TEXT,
    address TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des rendez-vous
CREATE TABLE IF NOT EXISTS public.appointments (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    log_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 3. Table des produits de la boutique
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT
);

-- 4. Table des commandes principales
CREATE TABLE IF NOT EXISTS public.orders (
    id SERIAL PRIMARY KEY,
    log_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    total NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending',
    delivery_address TEXT,
    payment_method TEXT
);

-- 5. Table de liaison pour les articles d'une commande
CREATE TABLE IF NOT EXISTS public.order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES public.orders(id) ON DELETE CASCADE,
    prod_id INT REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);