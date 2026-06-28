"use client";



import Link from "next/link";
import Image from "next/image";

import { signIn } from "next-auth/react";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Sparkles } from "lucide-react";

import { useI18n } from "@/components/i18n/locale-provider";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";



export default function LoginPage() {

  const router = useRouter();

  const { t } = useI18n();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);



  async function onSubmit(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);

    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });

    setLoading(false);

    if (res?.error) {

      setError(t.auth.invalidCredentials);

      return;

    }

    router.push("/dashboard");

    router.refresh();

  }



  return (

    <Card>

      <CardHeader className="text-center">

        <div className="mb-3 flex justify-center">

          <LanguageSwitcher />

        </div>

        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary overflow-hidden p-0.5 relative">

          <Image src="/logo.png" alt="Lingu logo" width={48} height={48} className="h-full w-full object-cover rounded-lg" />

        </div>

        <CardTitle className="text-2xl">{t.auth.loginTitle}</CardTitle>

        <CardDescription>{t.auth.loginSubtitle}</CardDescription>

      </CardHeader>

      <CardContent className="space-y-4">

        <form onSubmit={onSubmit} className="space-y-4">

          <div className="space-y-2">

            <Label htmlFor="email">{t.auth.email}</Label>

            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          </div>

          <div className="space-y-2">

            <Label htmlFor="password">{t.auth.password}</Label>

            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          </div>

          {error && <p className="text-sm text-warning">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>

            {loading ? t.auth.loginLoading : t.auth.login}

          </Button>

        </form>

        <Button variant="outline" className="w-full" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>

          {t.auth.loginGoogle}

        </Button>

        <p className="text-center text-sm text-muted-foreground">

          {t.auth.noAccount}{" "}

          <Link href="/auth/register" className="text-primary hover:underline">

            {t.auth.register}

          </Link>

        </p>

        <p className="text-center text-xs text-muted-foreground">{t.auth.demo}</p>

      </CardContent>

    </Card>

  );

}

