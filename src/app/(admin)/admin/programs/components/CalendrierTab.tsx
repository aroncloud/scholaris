import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Calendar, Plus } from "lucide-react"


const CalendrierTab = () => {
  return (
    <TabsContent value="calendrier" className="space-y-4">
        <Card>
            <CardHeader>
            <CardTitle>Calendrier académique</CardTitle>
            <CardDescription>
                Planning des périodes d&apos;enseignement et d&apos;évaluation
            </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>
                Fonctionnalité de calendrier académique en cours de
                développement
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Configurer le calendrier
                </Button>
            </div>
            </CardContent>
        </Card>
    </TabsContent>
)
}

export default CalendrierTab