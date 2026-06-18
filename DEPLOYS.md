# AVBT WEB - YAYINLAMA VE DEPLOY REHBERİ

Bu rehber, Mediterranean Data Science Community web sitesini Vercel üzerinde canlıya alma, CMS paneli için güvenli GitHub şifrelerini (Token) bağlama ve özel alan adınızı (Custom Domain) nameserver yönlendirmesiyle Vercel'e bağlama adımlarını içerir.

---

## 1. ADIM: GitHub Personal Access Token (PAT) Alma

Sitenin üzerindeki CMS panelinin doğrudan GitHub deponuza güvenli bir şekilde commit gönderebilmesi için özel bir şifre (Token) oluşturmanız gerekir:

1. **GitHub Ayarlarına Gidin**:
   - GitHub hesabınıza giriş yapın.
   - Sağ üstteki profil resminize tıklayıp **Settings** (Ayarlar) seçeneğini seçin.
2. **Developer Settings'e Geçin**:
   - Sol menünün en altındaki **Developer settings** başlığına tıklayın.
3. **Yeni Fine-grained Token Oluşturun**:
   - Sol menüden **Personal Access Tokens > Fine-grained tokens** yolunu izleyin.
   - Sağ üstteki **Generate new token** butonuna tıklayın (gerekirse şifre/2FA doğrulaması yapın).
4. **Token Detaylarını Ayarlayın**:
   - **Token name**: `avbt-cms-token` yazın.
   - **Expiration**: Geçerlilik süresini seçin (Örn: 90 gün veya 1 yıl).
   - **Repository access**: **"Only select repositories"** seçeneğini işaretleyin. Açılan listeden projenizin deposunu (**`canakbs/VBT-Web`**) bulup seçin.
5. **İzinleri (Permissions) Verin**:
   - **Repository permissions** başlığına tıklayarak yetkileri açın.
   - **Contents** (İçerikler) satırını bulun ve karşısındaki yetkiyi **Read and write** (Okuma ve Yazma) yapın.
6. **Token'ı Kopyalayın**:
   - Sayfanın en altındaki **Generate token** butonuna tıklayın.
   - Karşılaşacağınız `github_pat_...` kodunu **kopyalayıp güvenli bir yere kaydedin**. Sayfa kapatıldıktan sonra bu kod bir daha görüntülenemez.

---

## 2. ADIM: Projeyi Vercel'de Canlıya Alma ve Çevre Değişkenleri

1. **Vercel'e Giriş Yapın**:
   - [vercel.com](https://vercel.com) adresine gidin ve GitHub hesabınızla giriş yapın (Hobby - Ücretsiz plan tamamen yeterlidir).
2. **Projeyi Ekleyin**:
   - Paneldeki **"Add New" > "Project"** butonuna tıklayın.
   - GitHub depolarınız arasından **`canakbs/VBT-Web`** reposunun yanındaki **"Import"** butonuna tıklayın.
3. **Environment Variables (Çevre Değişkenlerini) Tanımlayın**:
   - Kurulum ekranındaki **Environment Variables** bölümünü genişletin.
   - Aşağıdaki iki adet değişkeni tanımlayın:
     * **Key**: `ADMIN_PASSCODE` / **Value**: `panel_giris_sifreniz` (Giriş paneli için şifre. Girmezseniz varsayılan olarak `avbt2026` aktif olur).
     * **Key**: `GITHUB_PAT` / **Value**: `1. Adımda kopyaladığınız github_pat_... kodu` (Doğrudan GitHub'a commit atmayı sağlar).
4. **Yayınlayın**:
   - **"Deploy"** butonuna tıklayın. Vercel sitenizi 1-2 dakika içinde derleyip canlıya alacaktır.

---

## 3. ADIM: Özel Alan Adını (Nameserver) Vercel'e Bağlama

Vercel size varsayılan olarak `.vercel.app` uzantılı ücretsiz bir adres verir. Kendi alan adınızı (Örn: `avbt.org` veya `akdenizveribilimi.org`) bağlamak için Nameserver (NS) yönlendirmesi yapmalısınız:

### 1. Alan Adını Vercel'e Tanımlama:
1. Vercel panelinde projenizin içine girin.
2. Üst menüden **Settings > Domains** sayfasına gidin.
3. **Domain** kutusuna kendi alan adınızı yazın (Örn: `avbt.org`) ve **Add** butonuna tıklayın.
4. Karşınıza iki seçenek çıkacaktır. **"Redirect to..."** önerisini onaylayarak hem `alanadiniz.com` hem de `www.alanadiniz.com` adreslerini ekleyin.

### 2. DNS Nameserver Bilgilerini Güncelleme:
Vercel, alan adını eklediğinizde size yönlendirmeniz gereken sunucu adreslerini gösterecektir. DNS yönetimini tamamen Vercel'e devretmek (en sorunsuz ve hızlı yoldur) için:

1. Alan adınızı satın aldığınız firmanın (GoDaddy, Metunic, Namecheap, Turhost vb.) kontrol paneline girin.
2. Alan adınızın detaylarından **DNS Ayarları / Nameserver Güncelleme** bölümünü bulun.
3. Mevcut nameserver adreslerini silin ve yerine **Vercel Nameserver** adreslerini yazın:
   * **`ns1.vercel-dns.com`**
   * **`ns2.vercel-dns.com`**
4. Ayarları kaydedin.

> [!NOTE]
> Nameserver (DNS) yönlendirmelerinin dünya genelinde aktif olması, alan adı sağlayıcınıza bağlı olarak **2 ile 24 saat arasında** sürebilir. Yönlendirme tamamlandığında Vercel siteniz için güvenlik sertifikasını (SSL) otomatik olarak oluşturacak ve siteniz alan adınız üzerinden yayına girecektir.
