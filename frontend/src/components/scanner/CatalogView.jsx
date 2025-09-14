import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Star, DollarSign, Info } from "lucide-react";

export default function CatalogView({ items, stand }) {
  if (!items || items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Catalog Available</h3>
          <p className="text-gray-600 mb-4">
            This exhibitor hasn't uploaded their product catalog yet.
          </p>
          <p className="text-sm text-gray-500">
            Visit their stand to learn more about their offerings!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Product Catalog</h3>
        <p className="text-gray-600">
          Explore {stand.company_name}'s featured products and services
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
            {item.image_url && (
              <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{item.name}</CardTitle>
                  {item.category && (
                    <Badge variant="secondary" className="mb-2">
                      {item.category}
                    </Badge>
                  )}
                </div>
                {item.price && (
                  <div className="text-right">
                    <div className="flex items-center text-green-600 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>{item.price}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{item.description}</p>
              
              {item.features && item.features.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Key Features
                  </h4>
                  <ul className="space-y-1">
                    {item.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="w-1 h-1 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {item.features.length > 3 && (
                      <li className="text-sm text-indigo-600 font-medium">
                        +{item.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Info className="w-6 h-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-indigo-900">Want to Learn More?</h3>
          </div>
          <p className="text-indigo-700 mb-4">
            Visit stand {stand.stand_number} to see these products in person and speak with their team.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" className="border-indigo-300 text-indigo-700">
              Visit Stand
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Contact Exhibitor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}