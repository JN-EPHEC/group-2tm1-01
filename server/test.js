import { supabase } from './src/config/supabase';
supabase.from('orders').select('*, order_items(*, products(*))').then(r => console.log(JSON.stringify(r.data, null, 2)));
//# sourceMappingURL=test.js.map