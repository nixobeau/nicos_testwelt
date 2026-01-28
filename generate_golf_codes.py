#!/usr/bin/env python3
"""
Script to generate 1000 golf codes for SQL INSERT statement
Usage: python3 generate_golf_codes.sql
"""

print("-- Insert 1000 golf codes (GOLF001 through GOLF1000)")
print("INSERT INTO golf_codes (code, ip_address, assigned_at) VALUES")

codes = []
for i in range(1, 1001):
    code = f"GOLF{i:04d}"  # GOLF0001, GOLF0002, ..., GOLF1000
    codes.append(f"('{code}', NULL, NULL)")

# Print first 20 codes normally
for code in codes[:20]:
    print(code + ",")

# Print rest in batches
print("-- And continue with dynamic generation for better performance:")
print("-- Run this in Supabase SQL editor to insert remaining codes:")
print("INSERT INTO golf_codes (code) SELECT 'GOLF' || LPAD(i::text, 4, '0') FROM generate_series(21, 1000) AS i;")
