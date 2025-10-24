import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { adminAPI } from '../services/api';

const AdminPricing = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    billing: 'month',
    trialInfo: '',
    features: '',
    searchesPerDay: 0,
    aiGenerations: 0,
    exportsPerMonth: 0,
    resultsPerCategory: 0,
    isPopular: false,
    isActive: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await adminAPI.getPricing();
      setPlans(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch pricing plans',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const planData = {
      ...formData,
      features: formData.features.split('\n').filter(f => f.trim()),
      price: parseFloat(formData.price),
      searchesPerDay: parseInt(formData.searchesPerDay),
      aiGenerations: parseInt(formData.aiGenerations),
      exportsPerMonth: parseInt(formData.exportsPerMonth),
      resultsPerCategory: parseInt(formData.resultsPerCategory)
    };

    try {
      if (editingPlan) {
        await adminAPI.updatePricing(editingPlan.id, planData);
        toast({ title: 'Success', description: 'Plan updated successfully' });
      } else {
        await adminAPI.createPricing(planData);
        toast({ title: 'Success', description: 'Plan created successfully' });
      }
      fetchPlans();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save plan',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billing: plan.billing,
      trialInfo: plan.trialInfo || '',
      features: plan.features.join('\n'),
      searchesPerDay: plan.searchesPerDay,
      aiGenerations: plan.aiGenerations,
      exportsPerMonth: plan.exportsPerMonth,
      resultsPerCategory: plan.resultsPerCategory,
      isPopular: plan.isPopular,
      isActive: plan.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      await adminAPI.deletePricing(planId);
      toast({ title: 'Success', description: 'Plan deleted successfully' });
      fetchPlans();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete plan',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      billing: 'month',
      trialInfo: '',
      features: '',
      searchesPerDay: 0,
      aiGenerations: 0,
      exportsPerMonth: 0,
      resultsPerCategory: 0,
      isPopular: false,
      isActive: true
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className=\"flex justify-between items-center mb-8\">
        <h1 className=\"text-3xl font-bold text-gray-900\">Pricing Plans</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className=\"w-4 h-4 mr-2\" />
              Add New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className=\"max-w-2xl max-h-[90vh] overflow-y-auto\">
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
              <DialogDescription>
                {editingPlan ? 'Update the pricing plan details' : 'Add a new pricing plan'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className=\"space-y-4\">
              <div className=\"grid grid-cols-2 gap-4\">
                <div>
                  <Label>Plan Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    type=\"number\"
                    step=\"0.01\"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className=\"grid grid-cols-2 gap-4\">
                <div>
                  <Label>Billing Period</Label>
                  <select
                    className=\"w-full border rounded-md p-2\"
                    value={formData.billing}
                    onChange={(e) => setFormData({ ...formData, billing: e.target.value })}
                  >
                    <option value=\"month\">Monthly</option>
                    <option value=\"year\">Yearly</option>
                    <option value=\"forever\">Forever</option>
                  </select>
                </div>
                <div>
                  <Label>Trial Info (optional)</Label>
                  <Input
                    value={formData.trialInfo}
                    onChange={(e) => setFormData({ ...formData, trialInfo: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Features (one per line)</Label>
                <Textarea
                  rows={5}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  required
                />
              </div>

              <div className=\"grid grid-cols-2 gap-4\">
                <div>
                  <Label>Searches Per Day</Label>
                  <Input
                    type=\"number\"
                    value={formData.searchesPerDay}
                    onChange={(e) => setFormData({ ...formData, searchesPerDay: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>AI Generations</Label>
                  <Input
                    type=\"number\"
                    value={formData.aiGenerations}
                    onChange={(e) => setFormData({ ...formData, aiGenerations: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Exports Per Month</Label>
                  <Input
                    type=\"number\"
                    value={formData.exportsPerMonth}
                    onChange={(e) => setFormData({ ...formData, exportsPerMonth: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Results Per Category</Label>
                  <Input
                    type=\"number\"
                    value={formData.resultsPerCategory}
                    onChange={(e) => setFormData({ ...formData, resultsPerCategory: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className=\"flex items-center space-x-4\">
                <div className=\"flex items-center space-x-2\">
                  <Switch
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
                  />
                  <Label>Mark as Popular</Label>
                </div>
                <div className=\"flex items-center space-x-2\">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label>Active</Label>
                </div>
              </div>

              <div className=\"flex justify-end space-x-2\">
                <Button type=\"button\" variant=\"outline\" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type=\"submit\">
                  {editingPlan ? 'Update' : 'Create'} Plan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <div className=\"flex justify-between items-start\">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                <div className=\"flex space-x-1\">
                  <Button variant=\"ghost\" size=\"sm\" onClick={() => handleEdit(plan)}>
                    <Edit className=\"w-4 h-4\" />
                  </Button>
                  <Button variant=\"ghost\" size=\"sm\" onClick={() => handleDelete(plan.id)}>
                    <Trash2 className=\"w-4 h-4 text-red-600\" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className=\"text-3xl font-bold mb-2\">
                ${plan.price}<span className=\"text-sm text-gray-600\">/{plan.billing}</span>
              </div>
              <div className=\"space-y-1 text-sm\">
                <div>{plan.searchesPerDay} searches/day</div>
                <div>{plan.aiGenerations} AI generations</div>
                <div>{plan.exportsPerMonth} exports/month</div>
              </div>
              <div className=\"mt-4 flex gap-2\">
                {plan.isPopular && (
                  <span className=\"text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded\">Popular</span>
                )}
                {plan.isActive ? (
                  <span className=\"text-xs bg-green-100 text-green-700 px-2 py-1 rounded\">Active</span>
                ) : (
                  <span className=\"text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded\">Inactive</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPricing;
