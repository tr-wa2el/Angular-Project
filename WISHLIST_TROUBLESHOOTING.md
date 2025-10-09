# Wishlist Troubleshooting Guide

## Problem: Wishlist page shows skeleton loading but no movies

### Step-by-Step Debugging:

1. **Check Browser Console**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for these logs:
     ```
     🎬 Loading wishlist movies... [array of IDs]
     ✅ Loaded movies: [array of movie objects]
     🎯 Final movies array: [filtered array]
     ```

2. **Check LocalStorage**
   - Open DevTools → Application → Local Storage
   - Look for key: `movieWishlist`
   - Should contain: `[123, 456, 789]` (array of movie IDs)
   - If empty: `[]`

3. **Test Adding Movies**
   ```javascript
   // In browser console:
   localStorage.setItem('movieWishlist', JSON.stringify([533535, 278, 238]));
   // Then reload the page
   ```

4. **Check API Calls**
   - DevTools → Network tab
   - Look for requests to: `https://api.themoviedb.org/3/movie/[id]`
   - Check response status (should be 200)
   - If 401: API key is invalid

5. **Verify Component State**
   ```javascript
   // In console (Angular DevTools needed):
   ng.getComponent($0) // Select the wishlist-container element first
   ```

### Common Issues:

#### Issue 1: Empty Wishlist
**Symptom**: Shows "Your wishlist is empty"
**Solution**: Add movies from home page by clicking heart icon

#### Issue 2: Skeleton Loading Forever
**Symptom**: Loading state never ends
**Cause**: API call failing
**Solution**: 
- Check API key in `environment.ts`
- Check network connectivity
- Check browser console for errors

#### Issue 3: Movies Added but Not Showing
**Symptom**: Counter shows number but page is empty
**Cause**: API response issue or filtering problem
**Solution**:
- Check console logs
- Verify movie IDs are valid
- Check API response format

### Manual Test:

1. Go to Home page (/)
2. Click heart icon on any movie
3. See notification: "Movie added to wishlist"
4. Check navbar: Badge should show "1"
5. Click "Wishlist" link in navbar
6. Should see the movie displayed

### Quick Fix Commands:

```javascript
// Clear wishlist and start fresh
localStorage.removeItem('movieWishlist');
location.reload();

// Add test movies
localStorage.setItem('movieWishlist', JSON.stringify([533535, 278, 238, 603, 155]));
location.reload();

// Check current wishlist
JSON.parse(localStorage.getItem('movieWishlist') || '[]');
```

### Expected Behavior:

1. **Empty State**: 
   - No movies in localStorage
   - Shows empty icon and message
   - Shows "Browse Movies" button

2. **Loading State**:
   - Movies in localStorage
   - Shows skeleton cards
   - Lasts 1-3 seconds

3. **Success State**:
   - Movies loaded successfully
   - Shows movie cards
   - Shows remove button on hover
   - Shows "Clear All" button

4. **Error State**:
   - API call failed
   - Shows error icon and message
   - Shows "Try Again" button

### Debug Script:

Add this to browser console:

```javascript
// Check service
const ws = ng.getInjector(document.querySelector('app-root')).get('WishlistService');
console.log('Wishlist IDs:', ws.getWishlist());
console.log('Count:', ws.getCount());

// Check localStorage
console.log('LocalStorage:', localStorage.getItem('movieWishlist'));

// Manually trigger load
// (Select wishlist component first)
ng.getComponent($0).loadWishlistMovies();
```

### Still Not Working?

Check these files for console logs:
- `src/app/pages/wishlist/wishlist.ts` - Should show loading logs
- `src/app/services/wishlist.service.ts` - Check getWishlist() return value
- `src/app/services/movie.service.ts` - Check getMovieDetails() calls

### API Response Check:

Test API directly:
```bash
curl "https://api.themoviedb.org/3/movie/533535?api_key=YOUR_KEY"
```

Should return movie object with:
- id
- title
- poster_path
- vote_average
- release_date
