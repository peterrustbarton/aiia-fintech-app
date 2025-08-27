
#!/usr/bin/env python3
"""
Database Setup Script for AiiA MVP
Handles database initialization and basic operations
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Run a shell command and return success status"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        if e.stdout:
            print(f"STDOUT: {e.stdout}")
        if e.stderr:
            print(f"STDERR: {e.stderr}")
        return False

def setup_database():
    """Main database setup function"""
    print("🏗️  AiiA Database Setup")
    print("=" * 40)
    
    # Change to app directory
    app_dir = Path(__file__).parent.parent
    os.chdir(app_dir)
    
    # Step 1: Generate Prisma client
    if not run_command("npx prisma generate", "Generating Prisma client"):
        return False
    
    # Step 2: Push schema to database
    if not run_command("npx prisma db push", "Pushing schema to database"):
        return False
    
    # Step 3: Seed the database
    if not run_command("yarn prisma db seed", "Seeding database with sample data"):
        return False
    
    print("\n🎉 Database setup completed successfully!")
    print("\nNext steps:")
    print("1. Test the database connection using: python database/connection.py")
    print("2. View the database in Prisma Studio: npx prisma studio")
    print("3. Start building your AiiA application!")
    
    return True

if __name__ == "__main__":
    success = setup_database()
    sys.exit(0 if success else 1)
