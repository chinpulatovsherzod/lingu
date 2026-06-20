"use client";



import Link from "next/link";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";

import { useI18n } from "@/components/i18n/locale-provider";



const levels = ["A1", "A2", "B1", "B2", "C1", "UNKNOWN"];

const goals = ["IELTS", "CAREER", "TRAVEL", "COMMUNICATION", "OTHER"];



export default function RegisterPage() {

  const router = useRouter();

  const { t } = useI18n();

  const [form, setForm] = useState({

    name: "",

    lastName: "",

    email: "",

    password: "",

    confirm: "",

    level: "UNKNOWN",

    goal: "IELTS",

  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);



  async function onSubmit(e: React.FormEvent) {

    e.preventDefault();

    if (form.password !== form.confirm) {

      setError(t.auth.passwordMismatch);

      return;

    }

    setLoading(true);

    setError("");

    const res = await fetch("/api/auth/register", {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(form),

    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {

      setError(data.error ?? t.auth.registerError);

      return;

    }

    router.push("/auth/login?registered=1");

  }



  return (

    <Card>

      <CardHeader>

        <div className="mb-3 flex justify-end">

          <LanguageSwitcher />

        </div>

        <CardTitle>{t.auth.registerTitle}</CardTitle>

        <CardDescription>{t.auth.registerSubtitle}</CardDescription>

      </CardHeader>

      <CardContent>

        <form onSubmit={onSubmit} className="space-y-4">

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="space-y-2">

              <Label>{t.auth.firstName}</Label>

              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />

            </div>

            <div className="space-y-2">

              <Label>{t.auth.lastName}</Label>

              <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />

            </div>

          </div>

          <div className="space-y-2">

            <Label>{t.auth.email}</Label>

            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />

          </div>

          <div className="space-y-2">

            <Label>{t.auth.password}</Label>

            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

          </div>

          <div className="space-y-2">

            <Label>{t.auth.confirmPassword}</Label>

            <Input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />

          </div>

          <div className="space-y-2">

            <Label>{t.auth.currentLevel}</Label>

            <select

              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"

              value={form.level}

              onChange={(e) => setForm({ ...form, level: e.target.value })}

            >

              {levels.map((l) => (

                <option key={l} value={l}>

                  {l === "UNKNOWN" ? t.auth.levelUnknown : l}

                </option>

              ))}

            </select>

          </div>

          <div className="space-y-2">

            <Label>{t.auth.learningGoal}</Label>

            <select

              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"

              value={form.goal}

              onChange={(e) => setForm({ ...form, goal: e.target.value })}

            >

              {goals.map((g) => (

                <option key={g} value={g}>

                  {t.auth.goals[g] ?? g}

                </option>

              ))}

            </select>

          </div>

          {error && <p className="text-sm text-warning">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>

            {loading ? t.auth.registerLoading : t.auth.register}

          </Button>

        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">

          {t.auth.hasAccount}{" "}

          <Link href="/auth/login" className="text-primary hover:underline">

            {t.auth.login}

          </Link>

        </p>

      </CardContent>

    </Card>

  );

}

