'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Eye,
  ChevronRight,
  ChevronDown,
  Building,
  Users,
  Clock,
  Target,
  Award,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import MaquetteCard from "@/components/cards/MaquetteCard";
import { v4 as uuidv4 } from 'uuid';
import { ICurriculumDetail } from "@/types/programTypes";

type MyComponentProps = {
    // setSelectedStudent: Dispatch<SetStateAction<IListStudent | null>>;
    // setIsStudentDialogOpen: Dispatch<SetStateAction<boolean>>;
    // setStudentToDelete: Dispatch<SetStateAction<string | null>>;
    // setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
    // setIsRequestDialogOpen: Dispatch<SetStateAction<boolean>>;
    // studentList: IListStudent[];
    // setAction: Dispatch<SetStateAction<'CREATE' | 'UPDATE'>>;
    // setFormData: Dispatch<React.SetStateAction<Partial<ICreateStudent>>>;
    curriculumList: ICurriculumDetail[];

};

const MaquettesTab = ({curriculumList}: MyComponentProps) => {
  return (
    <TabsContent value="maquettes" className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Maquettes de formation</h3>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {}}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une maquette
        </Button>
      </div>

      <div className="space-y-4">
        {/* Licence 3 Informatique */}
        {
          curriculumList.map(curric => {
            return <MaquetteCard
              key={uuidv4()}
              curriculum={curric}
              programName={curric.program.program_name}
            />
          })
        }
      </div>
    </TabsContent>
  )
}

export default MaquettesTab