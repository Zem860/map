import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Stepper } from '@/components/Stepper';
import type { OrderParams } from '@/type/order';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import type { UserFormValues } from '@/type/order';

const UserForm = () => {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const userInfo = userStore.userInfo?.data?.user;
  const fetchCart = useCartStore((s) => s.fetchCart);
  const carts = useCartStore((s) => s.carts);
  const form = useForm({
    defaultValues: {
      firstName: userInfo?.name?.split(', ')[0] || '',
      lastName: userInfo?.name?.split(', ')[1] || '',
      tel: userInfo?.tel || '',
      email: userInfo?.email || '',
      country: userInfo?.address?.split(', ')[0] || '',
      city: userInfo?.address?.split(', ')[1] || '',
      address: userInfo?.address?.split(', ')[2] || '',
      message: userStore.userInfo?.data?.message || '',
    },
  });

  const onSubmit = (data: UserFormValues) => {
    const fullAddress = `${data.country}, ${data.city}, ${data.address}`;
    const nameData = `${data.firstName}, ${data.lastName}`;
    const msg = data.message;
    const submittedData: OrderParams = {
      data: {
        user: {
          name: nameData,
          email: data.email,
          tel: data.tel,
          address: fullAddress,
        },
        message: msg,
      },
    };
    userStore.updateUserInfo(submittedData);
    navigate('/payment');
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (carts.data.carts.length === 0) {
      navigate('/cart');
    }
  }, [carts, navigate]);

  return (
    <>
      <div className="w-full max-w-2xl mx-auto px-4 py-12">
        <Stepper currentStep={2} className={'mb-10'} />
        <Link
          to="/cart"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-serif font-bold text-center mb-8 text-balance">
          Complete Your Information
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstName"
              rules={{ required: 'First name is required' }}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-foreground" htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="First Name"
                      id="firstName"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              rules={{ required: 'Last name is required' }}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-foreground" htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Last Name"
                      id="lastName"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tel"
              rules={{
                required: 'Telephone is required',
                pattern: {
                  value: /^[0-9+()\s-]{9,}$/,
                  message: 'Please enter a valid telephone number',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-foreground" htmlFor="tel">
                    Telephone <span className="text-destructive">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Telephone"
                      id="tel"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-foreground" htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email"
                      id="email"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              rules={{ required: 'Country is required' }}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-foreground" htmlFor="country">
                    Country <span className="text-destructive">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Country"
                      id="country"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              rules={{ required: 'City is required' }}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-foreground" htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="City"
                      id="city"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              rules={{ required: 'Address is required' }}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-foreground" htmlFor="address">
                    Address <span className="text-destructive">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Address"
                      id="address"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-foreground" htmlFor="message">
                    Message
                  </Label>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your message"
                      {...field}
                      id="message"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default UserForm;
