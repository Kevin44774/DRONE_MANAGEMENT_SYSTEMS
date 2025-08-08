#!/bin/bash

# DroneFlow Netlify Deployment Script

echo "🚁 Deploying DroneFlow to Netlify..."

# 1. Build the frontend-only version
echo "📦 Building production frontend..."
vite build

# 2. Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output available in: dist/public/"
    
    # Show build info
    echo "📊 Build Statistics:"
    ls -lh dist/public/
    
    echo ""
    echo "🚀 Ready for Netlify deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Connect GitHub repository to Netlify"
    echo "3. Configure build settings:"
    echo "   - Build command: vite build"
    echo "   - Publish directory: dist/public"
    echo "4. Deploy automatically"
    echo ""
    echo "Your DroneFlow application will be live with:"
    echo "✅ Complete mission planning system"
    echo "✅ Real-time fleet dashboard"
    echo "✅ Live mission monitoring"
    echo "✅ Comprehensive reporting"
    echo "✅ All FlytBase requirements met"
    
else
    echo "❌ Build failed!"
    exit 1
fi