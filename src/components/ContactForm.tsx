import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

const PRODUCT_OPTIONS = [
  { value: "ALL", label: "All Products", description: "Interest in our full product suite" },
  { value: "LIGHTFOOT", label: "LIGHTFOOT", description: "Network traffic analysis & forensics" },
  { value: "O-RANGE", label: "O-RANGE", description: "Operational range security testing" },
  { value: "SEEKCAP", label: "SEEKCAP", description: "Packet capture & deep inspection" },
  { value: "SECONDLOOK", label: "SECONDLOOK", description: "Linux memory forensics" },
  { value: "DDX", label: "DDX", description: "Deep packet inspection & analysis" },
  { value: "PARAGUARD", label: "PARAGUARD", description: "Intrusion detection & response" },
  { value: "PERPETUAL", label: "PERPETUAL", description: "Continuous security evaluation" },
];

const contactFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().trim().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  phone: z.string().trim().max(20, 'Phone must be less than 20 characters').optional(),
  company: z.string().trim().max(100, 'Company name must be less than 100 characters').optional(),
  productInterest: z.string().min(1, 'Please select a product'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
  createDemoAccount: z.boolean().default(false),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      productInterest: 'ALL',
      message: '',
      createDemoAccount: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // 1. Create CRM contact
      const { data: contact, error: contactError } = await supabase
        .from('crm_contacts')
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone || null,
          lead_source: 'Contact Form',
          notes: `Product Interest: ${data.productInterest}\n\nMessage:\n${data.message}${data.createDemoAccount ? '\n\n[Requested Demo Account]' : ''}`,
          tags: [data.productInterest, 'website-inquiry'],
          status: 'lead',
        })
        .select()
        .single();

      if (contactError) {
        console.error('CRM contact creation failed:', contactError);
        // Continue anyway - don't block the form submission
      }

      // 2. Send confirmation email to user
      const { error: userEmailError } = await supabase.functions.invoke('send-email-postmark', {
        body: {
          to: data.email,
          subject: 'Thank you for contacting Top Hat Security',
          template: 'contact_confirmation',
          data: {
            firstName: data.firstName,
            productInterest: data.productInterest,
            createDemoAccount: data.createDemoAccount,
          },
        },
      });

      if (userEmailError) {
        console.error('User confirmation email failed:', userEmailError);
      }

      // 3. Send notification to admins
      const { error: adminEmailError } = await supabase.functions.invoke('send-email-postmark', {
        body: {
          to: 'sales@tophatsecurity.com',
          subject: `New Contact Inquiry: ${data.firstName} ${data.lastName} - ${data.productInterest}`,
          template: 'contact_admin_notification',
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            company: data.company,
            productInterest: data.productInterest,
            message: data.message,
            createDemoAccount: data.createDemoAccount,
            contactId: contact?.id,
          },
        },
      });

      if (adminEmailError) {
        console.error('Admin notification email failed:', adminEmailError);
      }

      toast.success('Thank you for your inquiry! We will get back to you soon.');
      form.reset();
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      toast.error('Failed to submit your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Send Us a Message</CardTitle>
        <CardDescription>
          Fill out the form below and we'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productInterest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Interest *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product you're interested in" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRODUCT_OPTIONS.map((product) => (
                        <SelectItem key={product.value} value={product.value} className="py-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{product.label}</span>
                            <span className="text-xs text-muted-foreground">{product.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                      <SelectItem value="General Inquiry" className="py-3">
                        <div className="flex flex-col">
                          <span className="font-medium">General Inquiry</span>
                          <span className="text-xs text-muted-foreground">Questions about our company or services</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Partnership" className="py-3">
                        <div className="flex flex-col">
                          <span className="font-medium">Partnership Opportunity</span>
                          <span className="text-xs text-muted-foreground">Explore business partnerships</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Support" className="py-3">
                        <div className="flex flex-col">
                          <span className="font-medium">Technical Support</span>
                          <span className="text-xs text-muted-foreground">Get help with existing products</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your security needs and how we can help..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="createDemoAccount"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border/50 p-4 bg-muted/30">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      I'd like to create a demo account
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Request a free demo account to evaluate our products with full features for 14 days.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
