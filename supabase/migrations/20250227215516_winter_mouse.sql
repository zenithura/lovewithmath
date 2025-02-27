/*
  # Create tables for optimal selection app

  1. New Tables
    - `sessions`
      - `id` (uuid, primary key)
      - `total_candidates` (integer)
      - `criteria` (text array)
      - `observation_threshold` (integer)
      - `created_at` (timestamp)
    - `candidates`
      - `id` (bigint, primary key)
      - `session_id` (uuid, foreign key to sessions.id)
      - `name` (text)
      - `criteria_values` (jsonb)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on both tables
    - Add policies for public access (for simplicity in this demo)
*/

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_candidates integer NOT NULL,
  criteria text[] NOT NULL,
  observation_threshold integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  criteria_values jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
CREATE POLICY "Allow public read access to sessions"
  ON sessions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to sessions"
  ON sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read access to candidates"
  ON candidates
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to candidates"
  ON candidates
  FOR INSERT
  TO public
  WITH CHECK (true);